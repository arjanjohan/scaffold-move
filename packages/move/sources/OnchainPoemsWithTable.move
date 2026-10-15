module deployment_addr::onchain_poems_with_table {
    use std::signer;
    use std::string::String;
    use aptos_framework::event;
    use aptos_std::table::{Self, Table};

    struct PoemList has key {
        poems: Table<u64, Poem>,
        poem_counter: u64
    }

    #[event]
    struct Poem has store, drop, copy {
        poem_id: u64,
        address: address,
        poem: String,
        title: String,
        author: String
    }

    /// The account has not created a poem list yet
    const E_NOT_INITIALIZED: u64 = 1;

    public entry fun create_poem_list(account: &signer) {
        move_to(account, PoemList { poems: table::new(), poem_counter: 0 });
    }

    public entry fun create_poem(
        account: &signer,
        poem: String,
        title: String,
        author: String
    ) acquires PoemList {
        let signer_address = signer::address_of(account);
        assert!(exists<PoemList>(signer_address), E_NOT_INITIALIZED);

        let poem_list = &mut PoemList[signer_address];
        let poem_id = poem_list.poem_counter + 1;
        let new_poem = Poem { poem_id, address: signer_address, poem, title, author };

        poem_list.poems.upsert(poem_id, new_poem);
        poem_list.poem_counter = poem_id;
        event::emit(new_poem);
    }
}
