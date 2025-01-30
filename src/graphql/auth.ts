import { gql } from '@apollo/client';

export const LOGIN = gql`
mutation login($tel: String!, $code: String!) {
  login(tel: $tel, code: $code) {
    code
    message
  }
}
`;
