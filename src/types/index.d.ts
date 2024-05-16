interface RequestBody {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
}

type UserRole = "user" | "admin";

type UserPayload = JwtPayload & { userId: string; role: string; email: string };

type LoginResponse = {
  message: string;
  token?: string;
  userId?: number;
};

interface RegisterResponse {
  message: string;
  user?: object;
}

type DataResponse = {
  message?: string;
  data?: any;
};

interface FileUploaderProps {
  onUpload: (data: GeoJsonObject | null) => void;
}

interface MapContentProps {
  geojsonData: GeoJsonObject;
}

interface MapDisplayProps {
  geojsonData: GeoJsonObject;
}

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  content: any;
}

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
}

interface AuthContextType {
  auth: AuthState;
  login: (token: string) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}
