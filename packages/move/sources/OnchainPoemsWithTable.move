module deployment_addr::onchain_poems_with_table {
  use std::signer;
  use std::string::String;
  use aptos_framework::event;
  use aptos_std::table::{Self, Table};

  struct PoemList has key {
    poems: Table<u64, Poem>,
    poem_counter: u64
  }

  // Errors
  const E_NOT_INITIALIZED: u64 = 1;

  #[event]
  struct Poem has store, drop, copy {
      poem_id: u64,
      address: address,
      poem: String,
      title: String,
      author: String
  }

  public entry fun create_poem_list(account: &signer) {
      let poem_list = PoemList {
          poems: table::new(),
          poem_counter: 0
      };
      // move the PoemList resource under the signer account
      move_to(account, poem_list);
  }  

  const E_ALREADY_HAS:u64 = 1;

  public entry fun create_poem (account: &signer, poem: String, title: String, author: String) acquires PoemList {
        // gets the signer address
        let signer_address = signer::address_of(account);
        // assert signer has created a list
        assert!(exists<PoemList>(signer_address), E_NOT_INITIALIZED);
        // gets the PoemList resource
        let poem_list = borrow_global_mut<PoemList>(signer_address);
        // increment task counter
        let counter = poem_list.poem_counter + 1;
        // creates a new Task
        let new_task = Poem {
          poem_id: counter,
          address: signer_address,
          poem: poem,
          title: title,
          author: author
        };
        // adds the new task into the tasks table
        table::upsert(&mut poem_list.poems, counter, new_task);
        // sets the task counter to be the incremented counter
        poem_list.poem_counter = counter;
        // fires a new task created event
        event::emit(new_task);
  }

}