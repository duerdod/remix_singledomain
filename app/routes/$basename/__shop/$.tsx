import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useCatch, useLoaderData } from '@remix-run/react';

const DynamicRoute = () => {
  const data = useLoaderData();
  return (
    <div>
      <h1>{data?.route?.object?.name}</h1>
    </div>
  );
};

function CatchBoundary() {
  const caught = useCatch();
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <h1>Hoopers!</h1>
      <h2>{caught.status}</h2>
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
                route(path: "${path}") {
                    id
                    object {
                        ... on Category {
                            name
                        }
                        ... on Product {
                            name
                        }
                        ... on Page {
                            name
                        }
                    }
                }
            }
            `,
    }),
  });
  const data = await response.json();

  if (!data.data.route) {
    throw new Response('Not Found', {
      status: 404,
    });
  }

  return json(data.data, {
    headers: {
      'Cache-Control': 'max-age=600000000',
    },
  });
};

export { CatchBoundary, loader };
export default DynamicRoute;
