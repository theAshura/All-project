import { Form, FormInstance, Input } from "antd";
export interface Props {
  setVisibleModal: (data: boolean) => void;
  form: FormInstance;
}
const ProductSelectorForm = ({ setVisibleModal, form }: Props) => {
  const onFinish = () => {
    setVisibleModal(false);
  };

  return (
    <div>
      <Form
        form={form}
        name="basic"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item label="Product Selector Title" name="productSelectorTitle">
          <Input maxLength={60} placeholder="Type in Title of Products Page" />
        </Form.Item>
        <Form.Item
          label="Product Selector Short Description"
          name="productShortDes"
        >
          <Input
            maxLength={60}
            placeholder="Type in Product Selector Short Description"
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProductSelectorForm;
