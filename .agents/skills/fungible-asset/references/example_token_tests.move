#[test_only]
module deployment_addr::example_token_tests {
    use std::signer;
    use deployment_addr::example_token;

    #[test(admin = @deployment_addr, alice = @0xa11ce, bob = @0xb0b)]
    fun mint_transfer_burn(admin: &signer, alice: &signer, bob: &signer) {
        example_token::init_for_test(admin);
        let alice_addr = signer::address_of(alice);
        let bob_addr = signer::address_of(bob);
        example_token::mint(admin, alice_addr, 100);
        example_token::transfer(alice, bob_addr, 30);
        example_token::burn(bob, 10);
        assert!(example_token::balance(alice_addr) == 70, 0);
        assert!(example_token::balance(bob_addr) == 20, 1);
    }

    #[test(admin = @deployment_addr, alice = @0xa11ce)]
    #[expected_failure(abort_code = 0x50001, location = deployment_addr::example_token)]
    fun mint_by_non_admin_fails(admin: &signer, alice: &signer) {
        example_token::init_for_test(admin);
        example_token::mint(alice, signer::address_of(alice), 100);
    }
}
