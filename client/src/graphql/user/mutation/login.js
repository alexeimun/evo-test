import gql from 'graphql-tag';

const loginMutation = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      _id
      token
    }
  }
`;

export default loginMutation;
