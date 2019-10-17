import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';

const USERS_QUERY = gql`
	query allUsers {
		allUsers(skip: 10, first: 10) {
			id
			name
		}
	}
`;

/** @typedef {import('react-apollo').QueryHookOptions} QueryHookOptions*/

/**
 * - Example query
 *
 * @export
 * @param {QueryHookOptions} queryHookOptions
 * 
 * @returns QueryResult
 */
export default function useUsersQuery(queryHookOptions) {
	const queryResult = useQuery(USERS_QUERY, queryHookOptions);

	return queryResult;
}
