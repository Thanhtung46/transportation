// src/services/authService.ts
import api from './api';

export interface SignupData {
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
  phone_number: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  // Thêm các fields khác từ API trả về
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user?: UserProfile;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface ChangePasswordData{
    old_password: string;
    new_password: string;
    confirm_new_password: string;
}
export const authService = {
  // Đăng ký tài khoản
  async signup(data: SignupData): Promise<ApiResponse> {
    try {
      const response = await api.post('/auth/register/', data);
      
      return {
        success: true,
        message: 'Đăng ký thành công',
        data: response.data
      };
    } catch (error: any) {
      console.error('Signup API error:', error);
      
      // Xử lý lỗi từ Django
      let errorMessage = 'Đã có lỗi xảy ra khi đăng ký';
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Xử lý các lỗi validation từ Django
        if (errorData.email) {
          errorMessage = errorData.email[0];
        } else if (errorData.username) {
          errorMessage = errorData.username[0];
        } else if (errorData.password) {
          errorMessage = errorData.password[0];
        } else if (errorData.non_field_errors) {
          errorMessage = errorData.non_field_errors[0];
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        }
      }
      
      throw new Error(errorMessage);
    }
  },

  //change pass
  async changePassword(data: ChangePasswordData): Promise<ApiResponse> {
    try{
        console.log('Sending change password request');
        const response = await api.post('/auth/change-password/', data,{

        });
        return {
            success: true,
            message: 'Password changed successfully',
            data: response.data
        };
    }
    catch (error: any){
        console.error('Change password API error:', error);
        let errorMessage = 'An error occurred while changing the password';
         if (error.response?.data) {
        const errorData = error.response.data;
        
        if (errorData.old_password) {
          errorMessage = errorData.old_password[0];
        } else if (errorData.new_password) {
          errorMessage = errorData.new_password[0];
        } else if (errorData.non_field_errors) {
          errorMessage = errorData.non_field_errors[0];
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        }
      }
      throw new Error(errorMessage);
      
    }
  },

  // Quên mật khẩu - Gửi email reset
  async forgotPassword(email: string): Promise<ApiResponse> {
    try {
      const response = await api.post('/auth/forgot-password/', { email });
      
      return {
        success: true,
        message: 'Đã gửi hướng dẫn reset mật khẩu đến email của bạn',
        data: response.data
      };
    } catch (error: any) {
      console.error('Forgot password API error:', error);
      throw new Error('Không thể gửi yêu cầu reset mật khẩu');
    }
  }, 
    async resetPassword(token: string, newPassword: string): Promise<ApiResponse> {
        try {
        const response = await api.post('/auth/reset-password/', {
            token,
            new_password: newPassword
        });
        
        return {
            success: true,
            message: 'Reset mật khẩu thành công',
            data: response.data
        };
        } catch (error: any) {
        console.error('Reset password API error:', error);
        throw new Error('Không thể reset mật khẩu');
        }
    },

    async sendForgotPasswordOTP(email: string): Promise<ApiResponse> {
    try {
      console.log('📧 Sending forgot password OTP:', email);
      const response = await api.post('/auth/forgot-password/', { email });
      
      return {
        success: true,
        message: 'Mã OTP đã được gửi đến email của bạn',
        data: response.data
      };
    } catch (error: any) {
      console.error('❌ Send OTP error:', error);
      
      if (error.data?.email) {
        throw new Error(error.data.email[0]);
      }
      
      throw new Error(error.message);
    }
  },

  // Xác thực OTP quên mật khẩu
async verifyForgotPasswordOTP(email: string, otp: string): Promise<ApiResponse> {
  try {
    console.log('🔐 [DEBUG] Verifying OTP with email:', { email, otp });
    
    // QUAN TRỌNG: Gửi cả email và OTP
    const requestData = {
      email: email,  // ĐẢM BẢO CÓ EMAIL
      otp_code: otp
    };

    console.log('📤 [DEBUG] Request payload:', requestData);
    
    const response = await api.post('/auth/verify-otp/', requestData);
    
    console.log('✅ [DEBUG] OTP Verified Success:', response.data);
    
    return {
      success: true,
      message: 'Xác thực OTP thành công',
      data: response.data
    };
  } catch (error: any) {
    console.error('❌ [DEBUG] OTP Verification Failed:', error);
    
    // Xử lý lỗi
    if (error.response?.data?.otp) {
      throw new Error(error.response.data.otp[0]);
    } else if (error.response?.data?.email) {
      throw new Error(error.response.data.email[0]);
    } else if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    
    throw new Error(error.message || 'Xác thực OTP thất bại');
  }
},

  // Reset mật khẩu sau khi xác thực OTP
  async resetPasswordWithOTP(email: string, otp: string, newPassword: string): Promise<ApiResponse> {
    try {
      console.log('🔄 Resetting password with OTP');
      const response = await api.post('/auth/reset-password/', {
        email,
        otp,
        new_password: newPassword,
        confirm_new_password: newPassword
      });
      
      return {
        success: true,
        message: 'Reset mật khẩu thành công!',
        data: response.data
      };
    } catch (error: any) {
      console.error('❌ Reset password with OTP error:', error);
      
      if (error.data?.otp) {
        throw new Error(error.data.otp[0]);
      } else if (error.data?.new_password) {
        throw new Error(error.data.new_password[0]);
      }
      
      throw new Error(error.message);
    }
  },

  // Đăng nhập
  async login(username: string, password: string): Promise<AuthResponse> {
    try {
      const loginData: LoginData = {
        username,
        password
      };

      const response = await api.post('/auth/login/', loginData);
      
      console.log('Login API response:', response.data);
      
      // Lưu token vào AsyncStorage
      if (response.data.access) {
        // await AsyncStorage.setItem('accessToken', response.data.access);
        // await AsyncStorage.setItem('refreshToken', response.data.refresh);
        
        // Lưu thông tin user nếu có
        if (response.data.user) {
          // await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
        }
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Login API error:', error);
      
      let errorMessage = 'Đã có lỗi xảy ra khi đăng nhập';
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.non_field_errors) {
          errorMessage = errorData.non_field_errors[0];
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      }
      
      throw new Error(errorMessage);
    }
  },

  // Lấy thông tin profile
  async getProfile(): Promise<UserProfile> {
    try {
      // Lấy token từ storage
      // const token = await AsyncStorage.getItem('accessToken');
      
      const response = await api.get('/auth/profile/', {
        // headers: {
        //   Authorization: `Bearer ${token}`
        // }
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Get profile API error:', error);
      throw new Error('Không thể lấy thông tin người dùng');
    }
  },

  // Xác thực OTP (nếu có)
  async verifyCode(data: { email: string; code: string }) {
    // Tạm thời mock vì API của bạn chưa có OTP
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          success: true, 
          message: 'Xác thực thành công'
        });
      }, 1000);
    });
  },

  // Gửi lại OTP (nếu có)
  async resendCode(email: string) {
    // Tạm thời mock
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          success: true, 
          message: 'Đã gửi lại mã xác thực' 
        });
      }, 1000);
    });
  },

  // Lưu thông tin cá nhân
  async savePersonalData(data: any) {
    // Tạm thời mock - bạn có thể tích hợp với API update profile
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          success: true, 
          message: 'Lưu thông tin thành công',
          user: data 
        });
      }, 1500);
    });
  },

  // Refresh token
  async refreshToken(refreshToken: string) {
    try {
      const response = await api.post('/auth/token/refresh/', {
        refresh: refreshToken
      });
      
      return response.data;
    } catch (error: any) {
      throw new Error('Không thể refresh token');
    }
  },

  // Đăng xuất
  async logout() {
    try {
      // const token = await AsyncStorage.getItem('accessToken');
      
      await api.post('/auth/logout/', {}, {
        // headers: {
        //   Authorization: `Bearer ${token}`
        // }
      });
      
      // Xóa token khỏi storage
      // await AsyncStorage.removeItem('accessToken');
      // await AsyncStorage.removeItem('refreshToken');
      // await AsyncStorage.removeItem('userData');
      
      return { success: true, message: 'Đăng xuất thành công' };
    } catch (error: any) {
      console.error('Logout error:', error);
      // Vẫn xóa token ngay cả khi API fail
      // await AsyncStorage.removeItem('accessToken');
      // await AsyncStorage.removeItem('refreshToken');
      // await AsyncStorage.removeItem('userData');
      
      return { success: true, message: 'Đăng xuất thành công' };
    }
  }
};