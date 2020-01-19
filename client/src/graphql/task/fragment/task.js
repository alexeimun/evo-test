import gql from 'graphql-tag';

const taskFragment = gql`
  fragment taskFragment on Task {
    _id
    title
    priority
    expiresAt
    createdAt
  }
`;

export default taskFragment;
