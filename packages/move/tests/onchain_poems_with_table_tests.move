#[test_only]
module deployment_addr::onchain_poems_with_table_tests {
  use std::string::utf8;
  use std::vector;
  use aptos_framework::event;
  use deployment_addr::onchain_poems_with_table::{Self, Poem};

  #[test(account = @0x123)]
  fun create_poems_emits_events(account: &signer) {
    onchain_poems_with_table::create_poem_list(account);
    onchain_poems_with_table::create_poem(account, utf8(b"Roses are red"), utf8(b"Roses"), utf8(b"alice"));
    onchain_poems_with_table::create_poem(account, utf8(b"Violets are blue"), utf8(b"Violets"), utf8(b"alice"));
    assert!(vector::length(&event::emitted_events<Poem>()) == 2, 0);
  }

  #[test(account = @0x123)]
  #[expected_failure(abort_code = 1, location = deployment_addr::onchain_poems_with_table)] // E_NOT_INITIALIZED
  fun create_poem_without_list_fails(account: &signer) {
    onchain_poems_with_table::create_poem(account, utf8(b"Roses are red"), utf8(b"Roses"), utf8(b"alice"));
  }
}
