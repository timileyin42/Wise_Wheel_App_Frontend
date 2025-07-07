import { TextField, Button, Stack } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(8, 'Too short').required('Required')
});

export default function AuthForm({ type, onSubmit, loading }) {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      ...(type === 'register' && { phone: '' })
    },
    validationSchema,
    onSubmit
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack spacing={3}>
        <TextField
          name="email"
          label="Email"
          fullWidth
          {...formik.getFieldProps('email')}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />

        {type === 'register' && (
          <TextField
            name="phone"
            label="Phone"
            fullWidth
            {...formik.getFieldProps('phone')}
          />
        )}

        <TextField
          name="password"
          label="Password"
          type="password"
          fullWidth
          {...formik.getFieldProps('password')}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />

        <Button 
          type="submit" 
          variant="contained" 
          size="large"
          fullWidth
	  disabled={loading}
        >
         {loading ? 'Processing...' : type === 'login' ? 'Sign In' : 'Register'} 
        </Button>
      </Stack>
    </form>
  );
}
