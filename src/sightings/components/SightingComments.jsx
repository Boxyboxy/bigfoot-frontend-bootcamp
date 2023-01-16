import { Button, Form, Input } from 'antd';
import { useCallback } from 'react';
import { httpClient } from '../../common/httpClient';
import { useNotification } from '../../common/hooks/useNotification';

import { SightingComment } from './SightingComment';

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
        <SightingComment
          key={comment.id}
          comment={comment}
          commentIndex={index}
          comments={comments}
          setComments={setComments}
        />
      ))}
    </>
  );
}
