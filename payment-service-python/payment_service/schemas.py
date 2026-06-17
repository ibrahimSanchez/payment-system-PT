from pydantic import BaseModel


class PaymentRequest(BaseModel):
    monto: float
    tarjeta_id: int
    usuario_id: int


class PaymentResponse(BaseModel):
    aprobado: bool
    mensaje: str
    codigo: str
