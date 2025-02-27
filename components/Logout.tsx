import { Dialog, Icon } from "react-native-elements";

interface LogoutDialogProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  logout: () => void;
}
interface LogoutButtonProps {
  setVisible: (visible: boolean) => void;
}

function LogoutButton({ setVisible }: LogoutButtonProps) {
  return (
    <Icon
      containerStyle={{ alignSelf: "flex-end", marginRight: 10 }}
      name="logout"
      onPress={() => {
        setVisible(true);
      }}
    ></Icon>
  );
}

function LogoutDialog({ visible, setVisible, logout }: LogoutDialogProps) {
  return (
    <Dialog
      overlayStyle={{ borderRadius: 10, paddingRight: 50, maxWidth: 500 }}
      isVisible={visible}
      onBackdropPress={() => setVisible(false)}
    >
      <Dialog.Title title="Are you sure you want to logout?" />
      <Dialog.Actions>
        <Dialog.Button title="Cancel" onPress={() => setVisible(false)} />
        <Dialog.Button
          title="Yes"
          onPress={async () => {
            setVisible(false);
            logout();
          }}
        />
      </Dialog.Actions>
    </Dialog>
  );
}
export { LogoutDialog, LogoutButton };
