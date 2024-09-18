import { useModal } from "../../hooks/modalsHooks";
import ModalLayout from "../modals/ModalLayout";

/**
 * Example modal component. Shown via `ModalContext`
 * @param {{
 * title: string
 * }} props
 * @returns {React.FunctionComponent}
 */
export default function ExampleModalTwo({ title = "Test Modal Two" }) {
    const { hideModal } = useModal();

    const handleClose = () => {
        hideModal();
    };

    return (
        <ModalLayout>
            <ModalLayout.Header>
                <div className="w-100 d-flex justify-content-between">
                    <div>{title}</div>
                </div>
            </ModalLayout.Header>
            <ModalLayout.Body>
                <p style={{ height: 100 }}>Modal Body</p>
                <p style={{ height: 100 }}>Modal Body</p>
                <p style={{ height: 100 }}>Modal Body</p>
            </ModalLayout.Body>
            <ModalLayout.Footer>
                <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                    onClick={handleClose}
                >
                    Close
                </button>
            </ModalLayout.Footer>
        </ModalLayout>
    );
}
