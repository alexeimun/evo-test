import gql from 'graphql-tag';

const signupMutation = gql`
  mutation signup($user: UserInput!) {
    signup(user: $user) {
      _id
      createdAt
      email
      token
    }
  }
`;

export default signupMutation;
