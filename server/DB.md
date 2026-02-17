# Database

This project uses [Deno KV](https://deno.land/api@v1.40.5?s=Deno.Kv) as its
database. Deno KV is a key-value database built into the Deno runtime, providing
an easy way to persist data without external dependencies.

## Key Structure

The primary data entity is the `Question`. We store questions using a structured
key pattern to allow for efficient retrieval.

- **Primary Key for Questions**: `["questions_by_id", <question_id>]`
  - **Value**: The `Question` object, including its properties like `sentence`,
    `choices`, and `answer`.

This structure allows for direct lookup of a question by its ID.
