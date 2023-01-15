import { Comment } from '@ant-design/compatible';
import { formatDistance } from 'date-fns';
import { Tooltip } from 'antd';

export function SightingComments({ comments }) {
  return (
    <>
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          content={comment.content}
          datetime={
            <Tooltip title={comment.createdAt}>
              <span>
                {formatDistance(new Date(comment.createdAt), new Date(), { addSuffix: true })}{' '}
              </span>
            </Tooltip>
          }
        />
      ))}
    </>
  );
}
