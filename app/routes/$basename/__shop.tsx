import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, Outlet, useLoaderData } from '@remix-run/react';

export default function Shop() {
  const data = useLoaderData();
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <header
        style={{
          marginBottom: '2rem',
          background: 'orange',
          width: '100%',
          padding: '1rem',
          textAlign: 'center',
          height: '75px',
        }}
      >
        Header
        <ul
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '1rem',
            justifyContent: 'center',
          }}
        >
          {data.categories.map((category: any) => (
            <li key={category.id}>
              <Link to={`/b2b${category.primaryRoute.path}`}>
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </header>
      <main>
        <Outlet />
      </main>
      <footer
        style={{
          marginTop: 'auto',
          background: 'tomato',
          width: '100%',
          padding: '1rem',
          height: '400px',
          textAlign: 'center',
        }}
      >
        Footer
      </footer>
    </div>
  );
}

const loader = async (args: LoaderArgs) => {
  const basename = `/${args.params.basename!}`;
  const url = new URL(args.request.url);
  const path = url.pathname.replace(basename, '');

  const response = await fetch('https://stage.storeapi.jetshop.io', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      shopid: 'demostore',
      token: '359fd7c1-8e72-4270-b899-2bda9ae6ef57',
    },
    body: JSON.stringify({
      query: `
            query {
              categories {
                id
                name
                primaryRoute {
                  path
                }
              }
            }
            `,
    }),
  });
  const data = await response.json();
  return json(data.data, {
    headers: {
      'Cache-Control': 'max-age=600000000',
    },
  });
};

export { loader };
