def commit_callback(commit):
    if commit.author_name == b"sohampathakdnw":
        commit.author_name = b"pathaksoham2003"
        commit.author_email = b"pathaksoham2003@gmail.com"
    if commit.committer_name == b"sohampathakdnw":
        commit.committer_name = b"pathaksoham2003"
        commit.committer_email = b"pathaksoham2003@gmail.com"
