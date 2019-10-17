import React from 'react';
import Head from 'next/head';

// hooks
import useUsersQuery from './useUsersQuery';

export default function Home(props) {
	const { error, loading, data } = useUsersQuery();

	if (error) return 'Query error...';

	if (loading) return 'Loading...';

	return (
		<div>
			<Head>
				<title>next-apollo-boilerplate - Home page</title>
			</Head>
			Home page
			<div>Example query result:</div>
			<pre>{JSON.stringify(data, null, 4)}</pre>
		</div>
	);
}
