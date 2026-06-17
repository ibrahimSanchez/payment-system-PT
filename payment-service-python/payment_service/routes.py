from fastapi import APIRouter
from starlette.responses import RedirectResponse

from .schemas import PaymentRequest, PaymentResponse
from .services import process_payment

router = APIRouter()

@router.get('/')
def root():
    return RedirectResponse(url='/docs')

@router.get('/health')
def health_check():
    return {'status': 'ok', 'service': 'payment-processor'}

@router.post('/procesar-pago', response_model=PaymentResponse)
def procesar_pago(data: PaymentRequest):
    result = process_payment(data.monto, data.tarjeta_id, data.usuario_id)
    return PaymentResponse(**result)
