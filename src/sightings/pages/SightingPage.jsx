import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { httpClient } from '../../common/httpClient';
import { Button, Form, Space } from 'antd';
import { withPadding } from '../../common/hocs';
import { SightingForm } from '../components';
import { useNotification } from '../../common/hooks/useNotification';
import { SightingComments } from '../components/SightingComments';
import { LikeOutlined } from '@ant-design/icons';

export function SightingPage() {
  const { reportNumber } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isInvalidSighting, setIsInvalidSighting] = useState(false);
  const { notify, notifyContext } = useNotification();
  const [isEditing, setIsEditing] = useState(false);
  const [comments, setComments] = useState([]);
  const [sightingId, setSightingId] = useState(null);
  const [likes, setLikes] = useState(0);
  const [categories, setCategories] = useState([]);
  const [isFetchingSighting, setIsFetchingSighting] = useState(false);
  const [isFetchingCategories, setIsFetchingCategories] = useState(false);

  const fetchSighting = useCallback(() => {
    setIsFetchingSighting(true);
    httpClient
      .get(`/sightings/${reportNumber}`)
      .then(({ data }) => {
        data.categories = data.categories.map(({ id, name }) => ({ label: name, value: id }));
        form.setFieldsValue(data);
        setSightingId(data.id);
        setLikes(data.likes.length);
        if (data.comments) setComments(data.comments);
      })
      .catch((err) => {
        setIsInvalidSighting(true);
        notify('error', err?.response?.data?.error || err?.message);
      })
      .finally(() => setIsFetchingSighting(false));
  });

  const fetchCategories = useCallback(() => {
    setIsFetchingCategories(true);
    httpClient
      .get('/categories')
      .then(({ data }) => {
        console.log(data);
        setCategories(
          data.map(({ name, id }) => ({
            label: name,
            value: id
          }))
        );
      })
      .finally(() => setIsFetchingCategories(false));
  });

  const updateSighting = useCallback((reportNumber, payload) => {
    httpClient
      .patch(`/sightings/${reportNumber}`, payload)
      .then(() => {
        notify('success', 'Successfully updated sighting');
        setIsEditing(false);
        fetchSighting();
      })
      .catch((err) => notify('error', err?.response?.data?.error || err?.message));
  }, []);

  const likeSighting = useCallback(() => {
    httpClient.post(`/likes/${sightingId}`).then(() => setLikes((likes) => ++likes));
  }, [sightingId]);

  useEffect(() => {
    fetchSighting();
    fetchCategories();
  }, [reportNumber]);

  useEffect(() => {
    setIsLoading(isFetchingCategories || isFetchingSighting);
  }, [isFetchingCategories, isFetchingSighting]);

  return withPadding(
    <>
      {notifyContext}
      {!isLoading && (
        <Button styte={{ marginBottom: '1rem' }} type="primary" onClick={likeSighting}>
          <LikeOutlined /> {likes} Like(s)
        </Button>
      )}

      <SightingForm
        categories={categories}
        isLoading={isLoading}
        form={form}
        disabled={isInvalidSighting}
        isEditing={isEditing}
        style={{ marginBottom: '2rem' }}>
        <Space>
          {isEditing ? (
            <>
              <Button
                type="primary"
                onClick={() => {
                  const { reportNumber: reportNumber, ...payload } = form.getFieldValue();
                  updateSighting(reportNumber, payload);
                }}>
                Save
              </Button>
              <Button onClick={() => setIsEditing(false)} disabled={false}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setIsEditing(true)} disabled={isLoading} type="primary">
                Edit
              </Button>
              <Button onClick={() => navigate(-1)}>Back</Button>
            </>
          )}
        </Space>
      </SightingForm>

      <SightingComments comments={comments} sightingId={sightingId} setComments={setComments} />
    </>
  );
}
