module deployment_addr::onchain_poems {
    use std::signer;
    use std::string::String;

    struct Inscription has key, store, drop {
        poem: String,
        title: String,
        author: String
    }

    /// The account already has a poem
    const E_ALREADY_HAS: u64 = 1;

    public entry fun register(
        account: &signer,
        poem: String,
        title: String,
        author: String
    ) {
        assert!(
            !exists<Inscription>(signer::address_of(account)),
            E_ALREADY_HAS
        );
        move_to(account, Inscription { poem, title, author });
    }

    #[view]
    public fun get_poem(account: address): String acquires Inscription {
        Inscription[account].poem
    }
}
