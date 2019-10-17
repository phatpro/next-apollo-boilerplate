import { ApolloClient, InMemoryCache, HttpLink } from 'apollo-boost';
import fetch from 'isomorphic-unfetch';

let apolloClient = null;

function create(initialState) {
	const httpLinkOptions = {
		// GraphQL endpoint
		uri: 'https://api.graph.cool/simple/v1/ciyz901en4j590185wkmexyex/',
		// Use fetch() polyfill on the server
		fetch: !process.browser && fetch,
		// Include cookie in request
		credentials: 'include'
	};

	return new ApolloClient({
		// Turn on apollo dev tools
		connectToDevTools: true,
		// Disables forceFetch on the server (so queriese are only run once)
		ssrMode: !process.browser,
		link: new HttpLink(httpLinkOptions),
		cache: new InMemoryCache({
			// Custom map id
			dataIdFromObject: (object) => {
				if (object.slug) {
					return object.slug + '-' + object.__typename;
				}

				return object.id || object._id;
			}
		}).restore(initialState || {}),
		resolvers: {}
	});
}

function initApolloClient(initialState) {
	// Make sure to createa new client for every server-side request so that data
	// isn't shared between connections (which would be bad)
	if (!process.browser) {
		return create(initialState);
	}

	// Reuse client on the client-side
	if (!apolloClient) {
		apolloClient = create(initialState);
	}

	return apolloClient;
}

export default initApolloClient;
