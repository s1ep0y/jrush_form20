import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import {
  Form, Input, Button, Checkbox, InputNumber,
} from 'antd';

const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not validate email',
  },
};

export default class RegistrationForm extends React.Component {
  render() {
    return (
      <div>
        <Form>
          <Form.Item label="Name" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input.Password />
          </Form.Item>
          <Form.Item label="Password Repeat" name="passwordRepeat">
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{
              type: 'email',
            },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="website" label="Website">
            <Input />
          </Form.Item>
          <Form.Item label="Age" name="age">
            <InputNumber />
          </Form.Item>
          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[{
              validator: (_, value) => (value
                ? Promise.resolve()
                : Promise.reject('Should accept agreement')),
            },
            ]}
          >
            <Checkbox>
              I have read the
              <a href="#">agreement</a>
            </Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
