import React, { useState } from 'react';
import { useFormik } from 'formik';
import {
  Form, Input, Button, Checkbox, message,
} from 'antd';
import * as Yup from 'yup';
import axios from 'axios';


const RegistrationForm = () => {
  const [toShow, changeView] = useState('form');

  const passwordRegExp = new RegExp('^(?=.*[A-Z])(?=.*[0-9])(?=.{8,50}$)');

  const regShema = Yup.object().shape({
    name: Yup.string()
      .max(50, 'Maximum 50 symbols')
      .required('Please enter your name'),
    password: Yup.string()
      .matches(passwordRegExp, 'Password must be from 8 to 40 symbols, and contain at least one number and one'
      + ' capital letter')
      .required('Please enter your password'),
    email: Yup.string()
      .email('Invalid email')
      .required('Email is required'),
    confrirm: Yup.string()
      .oneOf([Yup.ref('password'), null], "Passwords don't match")
      .required('Please, confrim your password'),
    website: Yup.string()
      .url('Ivalid URL adress'),
    age: Yup.number()
      .required('Please enter your age')
      .min(18, 'You must be older')
      .max(65, 'You must be younger'),

  });

  const formik = useFormik({
    initialValues: {
      name: '',
      password: '',
      email: '',
      age: '',
      agreement: '',
    },
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
        .catch(({ response }) => {
          if (response.status === 404) {
            message.error('Our server does not response');
            return;
          }
          message.error(response.data.error);
        });
    },
  });


  const regForm = () => {
    const { errors, touched } = formik;

    return (
      <Form
        onFinish={formik.handleSubmit}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 12 }}
      >
        <Form.Item
          label="Name"
          name="name"
          className="requred"
          validateStatus={errors.name && touched.name ? 'error' : 'success'}
          help={errors.name && touched.name ? errors.name : null}
        >

          <Input onBlur={formik.handleBlur} onChange={formik.handleChange} />

        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          className="requred"
          validateStatus={errors.password && touched.password ? 'error' : 'success'}
          help={errors.password && touched.password ? errors.password : null}
        >
          <Input.Password onBlur={formik.handleBlur} onChange={formik.handleChange} />
        </Form.Item>
        <Form.Item
          name="confrirm"
          label="Confirm Password"
          className="requred"
          validateStatus={errors.confrirm && touched.confrirm ? 'error' : 'success'}
          help={errors.confrirm && touched.confrirm ? errors.confrirm : null}
        >
          <Input.Password onBlur={formik.handleBlur} onChange={formik.handleChange} />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          className="requred"
          validateStatus={errors.email && touched.email ? 'error' : 'success'}
          help={errors.email && touched.email ? errors.email : null}
        >
          <Input onChange={formik.handleChange} onBlur={formik.handleBlur} />
        </Form.Item>
        <Form.Item
          name="website"
          label="Website"
          validateStatus={errors.website && touched.website ? 'error' : 'success'}
          help={errors.website && touched.website ? errors.website : null}
        >
          <Input onChange={formik.handleChange} onBlur={formik.handleBlur} />
        </Form.Item>
        <Form.Item
          label="Age"
          name="age"
          className="requred"
          validateStatus={errors.age && touched.age ? 'error' : 'success'}
          help={errors.age && touched.age ? errors.age : null}
        >
          <Input
            type="number"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
        </Form.Item>

        <Form.Item label="Skills">

          <Form.Item
            name="skills_base"
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
