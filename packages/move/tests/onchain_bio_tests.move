#[test_only]
module deployment_addr::onchain_bio_tests {
    use std::signer;
    use std::string::utf8;
    use deployment_addr::onchain_bio;

    #[test(account = @0x123)]
    fun register_then_update(account: &signer) {
        let addr = signer::address_of(account);
        onchain_bio::register(account, utf8(b"alice"), utf8(b"first bio"));
        assert!(onchain_bio::get_bio(addr) == utf8(b"first bio"), 0);

        // Registering again updates the existing bio
        onchain_bio::register(account, utf8(b"alice"), utf8(b"second bio"));
        assert!(onchain_bio::get_bio(addr) == utf8(b"second bio"), 1);
    }

    #[test]
    #[expected_failure(major_status = 4008, location = deployment_addr::onchain_bio)]
    fun get_bio_without_bio_fails() {
        onchain_bio::get_bio(@0x123);
    }
}
