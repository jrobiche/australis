pub fn empty_string_option_to_none_option(v: Option<String>) -> Option<String> {
    let empty_string = String::from("");
    return match v {
        Some(x) => {
            if x == empty_string {
                None
            } else {
                Some(x)
            }
        }
        None => None,
    };
}
