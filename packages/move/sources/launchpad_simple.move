module deployment_addr::launchpad_simple {
    use std::option::{Self, Option};
    use std::signer;
    use std::string::{Self, String};
    use std::vector;

    use aptos_std::simple_map::{Self, SimpleMap};
    use aptos_std::string_utils;

    use aptos_framework::aptos_account;
    use aptos_framework::event;
    use aptos_framework::object::{Self, Object, ObjectCore};
    use aptos_framework::timestamp;

    use aptos_token_objects::collection::{Self, Collection};
    use aptos_token_objects::royalty::{Self, Royalty};
    use aptos_token_objects::token::{Self, Token};

    use minter::token_components;
    use minter::collection_components;

    /// Only admin can update creator
    const EONLY_ADMIN_CAN_UPDATE_CREATOR: u64 = 1;

    /// Only admin can update mint fee collector
    const EONLY_ADMIN_CAN_UPDATE_MINT_FEE_COLLECTOR: u64 = 4;
    /// Only admin can update mint enabled
    const EONLY_ADMIN_CAN_UPDATE_MINT_ENABLED: u64 = 11;
    /// Mint is disabled
    const EMINT_IS_DISABLED: u64 = 12;
    /// Cannot mint 0 amount
    const ECANNOT_MINT_ZERO: u64 = 13;

    /// Default to mint 0 amount to creator when creating collection
    const DEFAULT_PRE_MINT_AMOUNT: u64 = 0;
    /// Default mint fee per NFT denominated in oapt (smallest unit of APT, i.e. 1e-8 APT)
    const DEFAULT_MINT_FEE_PER_NFT: u64 = 0;

    /// 100 years in seconds, we consider mint end time to be infinite when it is set to 100 years after start time
    const ONE_HUNDRED_YEARS_IN_SECONDS: u64 = 100 * 365 * 24 * 60 * 60;


    #[event]
    struct CreateCollectionEvent has store, drop {
        collection_owner_obj: Object<CollectionOwnerObjConfig>,
        collection_obj: Object<Collection>,
        max_supply: Option<u64>,
        name: String,
        description: String,
        uri: String,
        pre_mint_amount: Option<u64>,
        mint_fee_per_nft: Option<u64>,
    }

    #[event]
    struct BatchMintNftsEvent has store, drop {
        collection_obj: Object<Collection>,
        nft_objs: vector<Object<Token>>,
        recipient_addr: address,
        total_mint_fee: u64,
    }

    #[event]
    struct BatchPreMintNftsEvent has store, drop {
        collection_obj: Object<Collection>,
        nft_objs: vector<Object<Token>>,
        recipient_addr: address,
    }

    /// Unique per collection
    /// We need this object to own the collection object instead of contract directly owns the collection object
    /// This helps us avoid address collision when we create multiple collections with same name
    struct CollectionOwnerObjConfig has key {
        collection_obj: Object<Collection>,
        extend_ref: object::ExtendRef,
    }

    /// Unique per collection
    struct CollectionConfig has key {
        // Key is stage, value is mint fee denomination
        mint_fee_per_nft: u64,
        mint_enabled: bool,
        unique_item_count: u64,
        collection_owner_obj: Object<CollectionOwnerObjConfig>,
        extend_ref: object::ExtendRef,
    }

    /// Global per contract
    struct Registry has key {
        collection_objects: vector<Object<Collection>>
    }

    /// Global per contract
    struct Config has key {
        // admin can set update mint fee collector, create FA and update creator
        admin_addr: address,
        mint_fee_collector_addr: address,
    }

    /// If you deploy the module under an object, sender is the object's signer
    /// If you deploy the module under your own account, sender is your account's signer
    fun init_module(sender: &signer) {
        move_to(sender, Registry {
            collection_objects: vector::empty()
        });
        move_to(sender, Config {
            admin_addr: signer::address_of(sender),
            mint_fee_collector_addr: signer::address_of(sender),
        });
    }

    // ================================= Entry Functions ================================= //
    /// Update mint enabled
    public entry fun update_mint_enabled(sender: &signer, collection_obj: Object<Collection>, enabled: bool) acquires Config, CollectionConfig {
        let sender_addr = signer::address_of(sender);
        let config = borrow_global_mut<Config>(@deployment_addr);
        assert!(is_admin(config, sender_addr), EONLY_ADMIN_CAN_UPDATE_MINT_ENABLED);
        let collection_obj_addr = object::object_address(&collection_obj);
        let collection_config = borrow_global_mut<CollectionConfig>(collection_obj_addr);
        collection_config.mint_enabled = enabled;
    }

    /// Update mint fee collector address
    public entry fun update_mint_fee_collector(sender: &signer, new_mint_fee_collector: address) acquires Config {
        let sender_addr = signer::address_of(sender);
        let config = borrow_global_mut<Config>(@deployment_addr);
        assert!(is_admin(config, sender_addr), EONLY_ADMIN_CAN_UPDATE_MINT_FEE_COLLECTOR);
        config.mint_fee_collector_addr = new_mint_fee_collector;
    }

    /// Create a collection, only admin or creator can create collection
    public entry fun create_collection(
        sender: &signer,
        description: String,
        name: String,
        uri: String,
        max_supply: Option<u64>,
        unique_item_count: u64,
        royalty_percentage: Option<u64>,
        // Pre mint amount to creator
        pre_mint_amount: Option<u64>,
        // Public mint fee per NFT denominated in oapt (smallest unit of APT, i.e. 1e-8 APT)
        mint_fee_per_nft: Option<u64>,
    ) acquires Registry, Config, CollectionConfig, CollectionOwnerObjConfig {
        let sender_addr = signer::address_of(sender);
        let config = borrow_global<Config>(@deployment_addr);
        

        let royalty = royalty(&mut royalty_percentage, sender_addr);

        let collection_owner_obj_constructor_ref = &object::create_object(@deployment_addr);
        let collection_owner_obj_signer = &object::generate_signer(collection_owner_obj_constructor_ref);
        
        let collection_obj_constructor_ref: &object::ConstructorRef;

        if (option::is_none(&max_supply)) {
            collection_obj_constructor_ref =
                &collection::create_unlimited_collection(
                    collection_owner_obj_signer,
                    description,
                    name,
                royalty,
                uri,
            );
        } else {
            collection_obj_constructor_ref =
                &collection::create_fixed_collection(
                    collection_owner_obj_signer,
                    description,
                    *option::borrow(&max_supply),
                    name,
                    royalty,
                    uri,
                );
        };
        let collection_obj_signer = &object::generate_signer(collection_obj_constructor_ref);
        let collection_obj_addr = signer::address_of(collection_obj_signer);
        let collection_obj = object::object_from_constructor_ref(collection_obj_constructor_ref);

        collection_components::create_refs_and_properties(collection_obj_constructor_ref);

        move_to(collection_owner_obj_signer, CollectionOwnerObjConfig {
            extend_ref: object::generate_extend_ref(collection_owner_obj_constructor_ref),
            collection_obj,
        });
        let collection_owner_obj = object::object_from_constructor_ref(collection_owner_obj_constructor_ref);
        move_to(collection_obj_signer, CollectionConfig {
            mint_fee_per_nft: *option::borrow_with_default(&mint_fee_per_nft, &DEFAULT_MINT_FEE_PER_NFT),
            mint_enabled: true,
            unique_item_count,
            extend_ref: object::generate_extend_ref(collection_obj_constructor_ref),
            collection_owner_obj,
        });

        let registry = borrow_global_mut<Registry>(@deployment_addr);
        vector::push_back(&mut registry.collection_objects, collection_obj);

        event::emit(CreateCollectionEvent {
            collection_owner_obj,
            collection_obj,
            max_supply,
            name,
            description,
            uri,
            pre_mint_amount,
            mint_fee_per_nft,
        });

        let nft_objs = vector[];
        for (i in 0..*option::borrow_with_default(&pre_mint_amount, &DEFAULT_PRE_MINT_AMOUNT)) {
            let nft_obj = mint_nft_internal(sender_addr, collection_obj);
            vector::push_back(&mut nft_objs, nft_obj);
        };

        event::emit(BatchPreMintNftsEvent {
            recipient_addr: sender_addr,
            collection_obj,
            nft_objs,
        });
    }

    /// Mint NFT, anyone with enough mint fee and has not reached mint limit can mint FA
    /// If we are in allowlist stage, only addresses in allowlist can mint FA
    public entry fun mint_nft(
        sender: &signer,
        collection_obj: Object<Collection>,
        amount: u64,
    ) acquires CollectionConfig, CollectionOwnerObjConfig, Config {
        assert!(amount > 0, ECANNOT_MINT_ZERO);
        assert!(is_mint_enabled(collection_obj), EMINT_IS_DISABLED);
        let sender_addr = signer::address_of(sender);


        let total_mint_fee = get_mint_fee(collection_obj, amount);
        pay_for_mint(sender, total_mint_fee);

        let nft_objs = vector[];
        for (i in 0..amount) {
            let nft_obj = mint_nft_internal(sender_addr, collection_obj);
            vector::push_back(&mut nft_objs, nft_obj);
        };

        event::emit(BatchMintNftsEvent {
            recipient_addr: sender_addr,
            total_mint_fee,
            collection_obj,
            nft_objs,
        });
    }

    // ================================= View  ================================= //

    #[view]
    /// Get contract admin
    public fun get_admin(): address acquires Config {
        let config = borrow_global<Config>(@deployment_addr);
        config.admin_addr
    }

    #[view]
    /// Get mint fee collector address
    public fun get_mint_fee_collector(): address acquires Config {
        let config = borrow_global<Config>(@deployment_addr);
        config.mint_fee_collector_addr
    }

    #[view]
    /// Get all collections created using this contract
    public fun get_registry(): vector<Object<Collection>> acquires Registry {
        let registry = borrow_global<Registry>(@deployment_addr);
        registry.collection_objects
    }

    #[view]
    /// Get unique item count for the collection
    public fun get_unique_item_count(collection_obj: Object<Collection>): u64 acquires CollectionConfig {
        let collection_config = borrow_global<CollectionConfig>(object::object_address(&collection_obj));
        collection_config.unique_item_count
    }


    #[view]
    /// Is mint enabled for the collection
    public fun is_mint_enabled(collection_obj: Object<Collection>): bool acquires CollectionConfig {
        let collection_addr = object::object_address(&collection_obj);
        let collection_config = borrow_global<CollectionConfig>(collection_addr);
        collection_config.mint_enabled
    }

    #[view]
    /// Get mint fee for a specific stage, denominated in oapt (smallest unit of APT, i.e. 1e-8 APT)
    public fun get_mint_fee(
        collection_obj: Object<Collection>,
        amount: u64,
    ): u64 acquires CollectionConfig {
        let collection_config = borrow_global<CollectionConfig>(object::object_address(&collection_obj));
        let fee = collection_config.mint_fee_per_nft;
        amount * fee
    }

    // ================================= Helpers ================================= //

    /// Check if sender is admin or owner of the object when package is published to object
    fun is_admin(config: &Config, sender: address): bool {
        if (sender == config.admin_addr) {
            true
        } else {
            if (object::is_object(@deployment_addr)) {
                let obj = object::address_to_object<ObjectCore>(@deployment_addr);
                object::is_owner(obj, sender)
            } else {
                false
            }
        }
    }

    /// Pay for mint
    fun pay_for_mint(sender: &signer, mint_fee: u64) acquires Config {
        if (mint_fee > 0) {
            aptos_account::transfer(sender, get_mint_fee_collector(), mint_fee);
        }
    }

    /// Create royalty object
    fun royalty(
        royalty_numerator: &mut Option<u64>,
        admin_addr: address,
    ): Option<Royalty> {
        if (option::is_some(royalty_numerator)) {
            let num = option::extract(royalty_numerator);
            option::some(royalty::create(num, 100, admin_addr))
        } else {
            option::none()
        }
    }

    /// Actual implementation of minting NFT
    fun mint_nft_internal(
        sender_addr: address,
        collection_obj: Object<Collection>,
    ): Object<Token> acquires CollectionConfig, CollectionOwnerObjConfig {
        let collection_config = borrow_global<CollectionConfig>(object::object_address(&collection_obj));

        let collection_owner_obj = collection_config.collection_owner_obj;
        let collection_owner_config = borrow_global<CollectionOwnerObjConfig>(
            object::object_address(&collection_owner_obj)
        );
        let collection_owner_obj_signer = &object::generate_signer_for_extending(&collection_owner_config.extend_ref);

        let next_nft_id = *option::borrow(&collection::count(collection_obj)) + 1;

        let collection_uri = collection::uri(collection_obj);
        let nft_metadata_uri = construct_nft_metadata_uri(&collection_uri, next_nft_id);

        let nft_obj_constructor_ref = &token::create(
            collection_owner_obj_signer,
            collection::name(collection_obj),
            // placeholder value, please read description from json metadata in offchain storage
            string_utils::to_string(&next_nft_id),
            // placeholder value, please read name from json metadata in offchain storage
            string_utils::to_string(&next_nft_id),
            royalty::get(collection_obj),
            nft_metadata_uri,
        );
        token_components::create_refs(nft_obj_constructor_ref);
        let nft_obj = object::object_from_constructor_ref(nft_obj_constructor_ref);
        object::transfer(collection_owner_obj_signer, nft_obj, sender_addr);

        nft_obj
    }

    /// Construct NFT metadata URI
    fun construct_nft_metadata_uri(
        collection_uri: &String,
        next_nft_id: u64,
    ): String {
        let nft_metadata_uri = &mut string::sub_string(
            collection_uri,
            0,
            string::length(collection_uri) - string::length(&string::utf8(b"collection.json"))
        );
        let nft_metadata_filename = string_utils::format1(&b"{}.json", next_nft_id);
        string::append(nft_metadata_uri, nft_metadata_filename);
        *nft_metadata_uri
    }

    // ================================= Uint Tests ================================== //

    #[test_only]
    public fun init_module_for_test(sender: &signer) {
        init_module(sender);
    }
}
