import { Comment } from '@ant-design/compatible';
import { Form, Space, Tooltip, Input } from 'antd';
import { CloseOutlined, DeleteOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { formatDistance, format } from 'date-fns';
import { useCallback, useState, useEffect } from 'react';
import { useNotification } from '../../common/hooks/useNotification';
import { httpClient } from '../../common/httpClient';

export function SightingComment({ comment, comments, setComments, commentIndex }) {
  const { notify, notifyContext } = useNotification();
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  // prevent memory leak: useCallback. Important when componant mounts and dismounts.
  // reduce the amount of memory usage within the particular function
  // caches function based on dependency array
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

  const updateComment = useCallback(() => {
    httpClient
      .patch(`/comments/${comment.id}`, {
        content: form.getFieldValue('comment_content')
      })
      .then(() => {
        notify('success', 'Updated comment');
        const newComments = [...comments];
        newComments[commentIndex].content = form.getFieldValue('comment_content');
        setIsEditing(false);
      });
    console.log(form.getFieldsValue());
  });
  useEffect(() => {
    form.setFieldValue('comment_content', comment.content);
  }, [comment, form]);

  return (
    <>
      {notifyContext}
      <Comment
        actions={
          isEditing
            ? [
                <span key="update-confirm" onClick={updateComment}>
                  <Space>
                    <SaveOutlined /> Save
                  </Space>
                </span>,
                <span key="update-cancel" onClick={() => setIsEditing(false)}>
                  <Space>
                    <CloseOutlined /> Cancel
                  </Space>
                </span>
              ]
            : [
                <span key="comment-edit" onClick={() => setIsEditing(true)}>
                  <Space>
                    <EditOutlined /> Edit
                  </Space>
                </span>,

                <span key="comment-delete" onClick={() => deleteComment(comment.id, commentIndex)}>
                  <Space>
                    <DeleteOutlined /> Delete
                  </Space>
                </span>
              ]
        }
        key={comment.id}
        content={
          <Form form={form} onSubmitCapture={updateComment}>
            {isEditing ? (
              <Form.Item name="comment_content" style={{ marginBottom: 0 }}>
                <Input />
              </Form.Item>
            ) : (
              comment.content
            )}
          </Form>
        }
        datetime={
          <Tooltip title={format(new Date(comment.createdAt), 'd MMM yy h.mm a')}>
            <span>
              {formatDistance(new Date(comment.createdAt), new Date(), { addSuffix: true })}{' '}
            </span>
          </Tooltip>
        }
      />
    </>
  );
}
