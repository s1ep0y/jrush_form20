import React, { useState } from 'react';
import { useFormik } from 'formik';
import {
  Form, Input, Button, Checkbox, message,
} from 'antd';
import * as Yup from 'yup';
import axios from 'axios';


const RegistrationForm = () => {
  const [toShow, changeView] = useState('form');

  const regShema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email')
      .required('Email is required'),
    website: Yup.string()
      .url('Ivalid URL adress'),

  });

  const formik = useFormik({
    initialValues: {},
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: regShema,
    onSubmit: async (values) => {
      const valKeys = Object.keys(values);
      const noEmpty = valKeys.reduce((acc, currentValue) => {
        if (values[currentValue]) {
          const elem = values[currentValue];
          return currentValue.includes('skill') ? { ...acc, skills: [...acc.skills, elem] }
            : { ...acc, [currentValue]: elem };
        }
        return { ...acc };
      },
      { skills: [] });

      await axios.post('https://regforserver.s1ep0y.now.sh/sign-up', noEmpty)
        .then(() => changeView('succes'))
        .catch((error) => {
          if (error.response.status === 409) {
            message.error('Email alredy exist');
            return;
          }
          message.error('Unexpected error');
        });
    },
  });


  const regForm = () => {
    const passwordRegExp = new RegExp('^(?=.*[A-Z])(?=.*[0-9])(?=.{8,50}$)');

    const validateMessages = {
      required: '"${name}" is required',
      pattern: {
        mismatch: ((name) => {
          if (name === 'password') {
            return 'Password must be from 8 to 40 symbols, and contain at least one number and one'
                            + ' capital letter';
          }
          return null;
        }),
      },
    };


    return (
      <Form
        validateMessages={validateMessages}
        onFinish={formik.handleSubmit}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 12 }}
      >
        <p>{JSON.stringify(formik.errors)}</p>
        <Form.Item
          label="Name"
          name="name"
          validateTrigger={['onBlur']}
          max={50}
          rules={[{
            required: true,
          },
          ]}
        >

          <Input onChange={formik.handleChange} />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          validateTrigger={['onBlur']}
          rules={[{
            required: true,
            pattern: passwordRegExp,
          },
          ]}
        >
          <Input.Password onChange={formik.handleChange} />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirm Password"
          validateTrigger={['onBlur']}
          dependencies={['password']}
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject('The two passwords that you entered do not match!');
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          validateStatus={formik.errors.email ? 'error' : 'success'}
          rules={[{ required: true }]}
          validateTrigger={['onBlur', 'onSubmit']}
          shouldUpdate
          help={formik.errors.email}
        >
          <Input onChange={formik.handleChange} onBlur={formik.handleBlur} />
        </Form.Item>
        <Form.Item
          name="website"
          label="Website"
          validateTrigger={['onBlur']}
          validateStatus={formik.errors.website ? 'error' : 'success'}
          help={formik.errors.website}
        >
          <Input onChange={formik.handleChange} onBlur={formik.handleBlur} />
        </Form.Item>
        <Form.Item
          label="Age"
          name="age"
          rules={[{
            required: true,
          },
          ]}
        >
          <Input
            type="number"
            validateTrigger={['onBlur']}
            min={18}
            max={65}
            onChange={formik.handleChange}
          />
        </Form.Item>

        <Form.Item label="skills">

          <Form.Item
            name="skills_base"
            validateTrigger={['onChange', 'onBlur']}
            rules={[{
              whitespace: true,
            },
            ]}
            noStyle="noStyle"
          >
            <Input
              onChange={formik.handleChange}
              style={{
                marginBottom: '24px',
              }}
            />
          </Form.Item>
          <Form.List name="skills">
            {
        (fields, { add }) => (
          <div>
            {
              fields.map((field) => (
                <Form.Item key={field.key}>
                  <Form.Item
                    {...field}
                    validateTrigger={['onChange', 'onBlur']}
                    rules={[{
                      whitespace: true,
                    },
                    ]}

                    style={{ marginBottom: '0px' }}
                  >
                    <Input
                      onChange={formik.handleChange}
                    />
                  </Form.Item>
                </Form.Item>
              ))
}
            <Form.Item style={{ width: 90 }}>
              <Button
                type="dashed"
                onClick={() => {
                  add();
                }}
              >
                Add field
              </Button>
            </Form.Item>
          </div>
        )
              }
          </Form.List>

        </Form.Item>

        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[{
            validator: (rule, value) => (
              value
                ? Promise.resolve()
                : Promise.reject('Should accept agreement')
            ),
          },
          ]}
        >
          <Checkbox>
            I have read the
            <a href="#">
              {' '}
              agreement
            </a>
          </Checkbox>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    );
  };

  return (
    <div>
      {toShow === 'form' ? regForm() : <p>Now your registered</p>}
    </div>
  );
};

export default RegistrationForm;
