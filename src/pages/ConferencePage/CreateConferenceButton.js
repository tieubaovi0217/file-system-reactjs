import { useState } from 'react';

import axios from 'axios';
import * as moment from 'moment';

import {
  Button,
  Divider,
  Modal,
  Form,
  Input,
  message,
  Space,
  DatePicker,
} from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

import { buildPath } from 'common/helpers';

const { RangePicker } = DatePicker;

const CreateConferenceButton = () => {
  const [visible, setVisible] = useState(false);

  const onFinish = async (values) => {
    try {
      console.log(values);
      const resp = await axios.post(buildPath('/conference'), values, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });
      console.log(resp);
      message.success('Create conference successfully!');
    } catch (error) {
      console.log(error.response?.data);
      message.error(error.response?.data?.error || 'Server Error');
    }
  };

  return (
    <>
      <Button
        type="dashed"
        size={'large'}
        icon={<PlusOutlined />}
        onClick={() => setVisible(true)}
        style={{
          marginLeft: '16px',
          borderRadius: '24px',
          boxShadow:
            'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
        }}
      >
        Create your own conference
      </Button>
      <Modal
        title={
          <Divider>
            <h1>Set up new conference</h1>
          </Divider>
        }
        centered
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        width={800}
      >
        <Form
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 14,
          }}
          layout="horizontal"
          onFinish={onFinish}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: 'Please type your conference name!',
              },
            ]}
          >
            <Input autoFocus allowClear placeholder="Conference name..." />
          </Form.Item>

          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: 'Please select date' }]}
          >
            <RangePicker
              ranges={{
                Today: [moment(), moment()],
                'This Month': [
                  moment().startOf('month'),
                  moment().endOf('month'),
                ],
              }}
              showTime
              format="YYYY/MM/DD HH:mm:ss"
            />
          </Form.Item>
          <div style={{ marginLeft: '124px' }}>
            <Form.List name="editors">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space
                      key={key}
                      style={{
                        display: 'flex',
                      }}
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        name={[name, 'username']}
                        rules={[
                          {
                            required: true,
                            message: 'Missing username',
                          },
                        ]}
                      >
                        <Input
                          style={{ width: '200px' }}
                          placeholder="Username of editor"
                        />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add editor
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </div>
          <div className="flex justify-content-center">
            <Button htmlType="submit">Submit</Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default CreateConferenceButton;
