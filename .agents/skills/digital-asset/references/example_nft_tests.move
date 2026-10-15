#[test_only]
module deployment_addr::example_nft_tests {
    use std::signer;
    use std::string::utf8;
    use aptos_framework::object;
    use aptos_token_objects::token::Token;
    use deployment_addr::example_nft;

    #[test(admin = @deployment_addr, alice = @0xa11ce)]
    fun mint_and_burn(admin: &signer, alice: &signer) {
        example_nft::init_for_test(admin);
        example_nft::mint(admin, signer::address_of(alice), utf8(b"#1"), utf8(b"https://example.com/1.json"));
        let token = object::address_to_object<Token>(example_nft::token_address(utf8(b"#1")));
        assert!(object::is_owner(token, signer::address_of(alice)), 0);
        example_nft::burn(alice, token);
    }

    #[test(admin = @deployment_addr, alice = @0xa11ce)]
    #[expected_failure(abort_code = 0x50001, location = deployment_addr::example_nft)]
    fun mint_by_non_admin_fails(admin: &signer, alice: &signer) {
        example_nft::init_for_test(admin);
        example_nft::mint(alice, signer::address_of(alice), utf8(b"#1"), utf8(b"uri"));
    }

    #[test(admin = @deployment_addr, alice = @0xa11ce, bob = @0xb0b)]
    #[expected_failure(abort_code = 0x50002, location = deployment_addr::example_nft)]
    fun burn_by_non_owner_fails(admin: &signer, alice: &signer, bob: &signer) {
        example_nft::init_for_test(admin);
        example_nft::mint(admin, signer::address_of(alice), utf8(b"#1"), utf8(b"uri"));
        let token = object::address_to_object<Token>(example_nft::token_address(utf8(b"#1")));
        example_nft::burn(bob, token);
    }
}
