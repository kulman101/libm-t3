import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const books = await api.book.getAll();

  return (
    <HydrateClient>
      <div>
        {books?.map((book) => (
          <div key={book.id}>
            <h3>{book.title}</h3>
            <p>{book.description}</p>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Genre:</strong> {book.genre}</p>
            <p><strong>Published At:</strong>{book.publishedAt?.toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </HydrateClient>
  );
}
