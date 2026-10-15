module deployment_addr::example_nft {
    use std::error;
    use std::option;
    use std::signer;
    use std::string::{String, utf8};
    use aptos_framework::object::{Self, Object};
    use aptos_token_objects::collection;
    use aptos_token_objects::royalty;
    use aptos_token_objects::token::{Self, BurnRef, Token};

    const COLLECTION_NAME: vector<u8> = b"Example Collection";
    const MAX_SUPPLY: u64 = 1000;

    const E_NOT_ADMIN: u64 = 1;
    const E_NOT_OWNER: u64 = 2;

    /// Kept on each token, so its owner can burn it through this module
    struct TokenRefs has key {
        burn_ref: BurnRef,
    }

    fun init_module(admin: &signer) {
        collection::create_fixed_collection(
            admin,
            utf8(b"An example collection"),
            MAX_SUPPLY,
            utf8(COLLECTION_NAME),
            option::some(royalty::create(5, 100, signer::address_of(admin))), // 5%
            utf8(b"https://example.com/collection.json"),
        );
    }

    /// Mints a named token (address derived from creator, collection and name) and sends it to `to`
    public entry fun mint(admin: &signer, to: address, name: String, uri: String) {
        assert!(signer::address_of(admin) == @deployment_addr, error::permission_denied(E_NOT_ADMIN));
        let constructor_ref = &token::create_named_token(
            admin,
            utf8(COLLECTION_NAME),
            utf8(b"An example token"),
            name,
            option::none(), // the collection's royalty
            uri,
        );
        move_to(&object::generate_signer(constructor_ref), TokenRefs {
            burn_ref: token::generate_burn_ref(constructor_ref),
        });
        object::transfer(admin, object::object_from_constructor_ref<Token>(constructor_ref), to);
    }

    public entry fun burn(owner: &signer, token: Object<Token>) acquires TokenRefs {
        assert!(object::is_owner(token, signer::address_of(owner)), error::permission_denied(E_NOT_OWNER));
        let TokenRefs { burn_ref } = move_from<TokenRefs>(object::object_address(&token));
        token::burn(burn_ref);
    }

    #[view]
    public fun token_address(name: String): address {
        token::create_token_address(&@deployment_addr, &utf8(COLLECTION_NAME), &name)
    }

    #[test_only]
    public fun init_for_test(admin: &signer) {
        init_module(admin);
    }
}
