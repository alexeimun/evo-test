import gql from 'graphql-tag';
import taskFragment from '../fragment/task';

const tasksQuery = gql`
  query {
    tasks {
      ...taskFragment
    }
  }
  ${taskFragment}
`;

export default tasksQuery;
