import PhoneInput from './PhoneInput';
import OptStatusRadio from './OptStatusRadio';

export default function SingleContactForm(props) {
  return (
    <>
      <PhoneInput {...props} />
      <OptStatusRadio {...props} />
    </>
  );
}
