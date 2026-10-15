module deployment_addr::example_token {
    use std::error;
    use std::option;
    use std::signer;
    use std::string::utf8;
    use aptos_framework::fungible_asset::{Self, BurnRef, Metadata, MintRef};
    use aptos_framework::object::{Self, Object};
    use aptos_framework::primary_fungible_store;

    /// Seed of the metadata object, so its address is known: create_object_address(@deployment_addr, SEED)
    const SEED: vector<u8> = b"EXAMPLE_TOKEN";
    const MAX_SUPPLY: u128 = 1_000_000_00000000; // 1M tokens with 8 decimals

    const E_NOT_ADMIN: u64 = 1;

    /// Kept on the metadata object; only this module can use them
    struct Refs has key {
        mint_ref: MintRef,
        burn_ref: BurnRef,
    }

    fun init_module(admin: &signer) {
        let constructor_ref = &object::create_named_object(admin, SEED);
        primary_fungible_store::create_primary_store_enabled_fungible_asset(
            constructor_ref,
            option::some(MAX_SUPPLY),
            utf8(b"Example Token"),
            utf8(b"EXT"),
            8,
            utf8(b"https://example.com/icon.png"),
            utf8(b"https://example.com"),
        );
        move_to(&object::generate_signer(constructor_ref), Refs {
            mint_ref: fungible_asset::generate_mint_ref(constructor_ref),
            burn_ref: fungible_asset::generate_burn_ref(constructor_ref),
        });
    }

    #[view]
    public fun metadata(): Object<Metadata> {
        object::address_to_object(object::create_object_address(&@deployment_addr, SEED))
    }

    #[view]
    public fun balance(owner: address): u64 {
        primary_fungible_store::balance(owner, metadata())
    }

    public entry fun mint(admin: &signer, to: address, amount: u64) acquires Refs {
        assert!(signer::address_of(admin) == @deployment_addr, error::permission_denied(E_NOT_ADMIN));
        let refs = borrow_global<Refs>(object::object_address(&metadata()));
        primary_fungible_store::mint(&refs.mint_ref, to, amount);
    }

    /// Wrapped so the frontend can call it through this module's typed ABI
    public entry fun transfer(sender: &signer, to: address, amount: u64) {
        primary_fungible_store::transfer(sender, metadata(), to, amount);
    }

    public entry fun burn(owner: &signer, amount: u64) acquires Refs {
        let refs = borrow_global<Refs>(object::object_address(&metadata()));
        let fa = primary_fungible_store::withdraw(owner, metadata(), amount);
        fungible_asset::burn(&refs.burn_ref, fa);
    }

    #[test_only]
    public fun init_for_test(admin: &signer) {
        init_module(admin);
    }
}
