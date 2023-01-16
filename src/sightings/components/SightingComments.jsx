import { Comment } from '@ant-design/compatible';
import { formatDistance, format } from 'date-fns';
import { Button, Form, Input, Space, Tooltip } from 'antd';
import { useCallback } from 'react';
import { httpClient } from '../../common/httpClient';
import { useNotification } from '../../common/hooks/useNotification';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

export function SightingComments({ comments, sightingId, setComments }) {
  const [form] = Form.useForm();
  // eslint-disable-next-line no-unused-vars
  const { notify, notifyContext } = useNotification();

  const createComment = useCallback(() => {
    httpClient
      .post(`/comments/${sightingId}`, { content: form.getFieldValue('new_comment') })
      .then(({ data: newComment }) => {
        notify('success', 'Created a new comment');
        setComments([newComment, ...comments]);
        form.resetFields();
      });
  }, [sightingId, comments]);

  const deleteComment = useCallback(
    (commentId, commentIndex) => {
      httpClient.delete(`/comments/${commentId}`).then(() => {
        notify('success', 'Deleted comment');
        const newComments = [...comments];
        console.log(newComments);
        newComments.splice(commentIndex, 1);
        setComments(newComments);
      });
    },
    [comments]
  );

  return (
    <>
      <Form form={form} layout="inline" onSubmitCapture={createComment}>
        <Form.Item name="new_comment">
          <Input placeholder="Write a comment" style={{ minWidth: '400px' }} />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
      {comments.map((comment, index) => (
        <Comment
          actions={[
            <span key="comment-edit">
              <Space>
                <EditOutlined /> Edit
              </Space>
            </span>,

            <span key="comment-delete" onClick={() => deleteComment(comment.id, index)}>
              <Space>
                <DeleteOutlined /> Delete
              </Space>
            </span>
          ]}
          key={comment.id}
          content={comment.content}
          datetime={
            <Tooltip title={format(new Date(comment.createdAt), 'd MMM yy h.mm a')}>
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
