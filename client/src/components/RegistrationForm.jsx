import React, { useState } from 'react';
import { useFormik } from 'formik';
import {
  Form, Input, Button, Checkbox,
} from 'antd';
import { string } from 'yup';
import axios from 'axios';

const RegistrationForm = () => {
  const [toShow, changeView] = useState('form');
  const [emailTook, changeEmailStatus] = useState(false);

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

  const formik = useFormik({
    initialValues: {},
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

      try {
        const res = await axios.post('https://regforserver.s1ep0y.now.sh/sign-up', noEmpty);
        changeView('succes');
      } catch (err) {
        console.log(err);
        changeEmailStatus(true);
        throw new Error(err);
      }
    },
  });

  const form = (emtook) => (
    <Form validateMessages={validateMessages} onFinish={formik.handleSubmit}>
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
        validateTrigger={['onBlur', 'onSubmit']}
        shouldUpdate
        rules={[
          {
            required: true,
          },
          () => ({
            validator(rule, value) {
              if (emtook) return Promise.reject('Email alredy took');
              if (string().email().isValidSync(value)) return Promise.resolve();
              return Promise.reject('Incorrect email adress');
            },
          }),
        ]}
      >
        <Input onChange={formik.handleChange} />
      </Form.Item>
      <Form.Item
        name="website"
        label="Website"
        validateTrigger={['onBlur']}
        rules={[
          {}, () => ({
            validator(rule, value) {
              if (string().url().isValidSync(value)) return Promise.resolve();
              return Promise.reject('Incorrect website adress');
            },
          }),
        ]}
      >
        <Input onChange={formik.handleChange} />
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
              width: '80%',
              marginBottom: '24px',
            }}
          />
        </Form.Item>
        <Form.List name="skills">
          {
        (fields = [{}], { add }) => (
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
                      style={{
                        width: '80%',
                      }}
                    />
                  </Form.Item>
                </Form.Item>
              ))
}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => {
                  add();
                }}
                style={{
                  width: '60%',
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
          <a href="#">agreement</a>
        </Checkbox>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
  );

  return (
    <div>
      {toShow === 'form' ? form(emailTook) : <p>Now your registered</p>}
    </div>
  );
};

export default RegistrationForm;
