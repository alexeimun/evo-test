import gql from 'graphql-tag';

const createTaskMutation = gql`
  mutation createTask($task: TaskInput!) {
    createTask(task: $task) {
      _id
      title
      priority
      expiresAt
      createdAt
    }
  }
`;

export default createTaskMutation;
