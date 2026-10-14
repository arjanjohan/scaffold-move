#[test_only]
module deployment_addr::onchain_poems_tests {
  use std::string::utf8;
  use deployment_addr::onchain_poems;

  #[test(account = @0x123)]
  fun register_then_get_poem(account: &signer) {
    onchain_poems::register(account, utf8(b"Roses are red"), utf8(b"Roses"), utf8(b"alice"));
    assert!(onchain_poems::get_poem(@0x123) == utf8(b"Roses are red"), 0);
  }

  #[test(account = @0x123)]
  #[expected_failure(abort_code = 1, location = deployment_addr::onchain_poems)] // E_ALREADY_HAS
  fun register_twice_fails(account: &signer) {
    onchain_poems::register(account, utf8(b"Roses are red"), utf8(b"Roses"), utf8(b"alice"));
    onchain_poems::register(account, utf8(b"Violets are blue"), utf8(b"Violets"), utf8(b"alice"));
  }
}
