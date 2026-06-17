from fastapi import FastAPI
from pydantic import BaseModel
import random
from starlette.responses import RedirectResponse

app = FastAPI(title="Payment Processor Service")

class PaymentRequest(BaseModel):
    monto: float
    tarjeta_id: int
    usuario_id: int

class PaymentResponse(BaseModel):
    aprobado: bool
    mensaje: str
    codigo: str

@app.get("/")
def root():
    return RedirectResponse(url="/docs")

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "payment-processor"}

@app.post("/procesar-pago", response_model=PaymentResponse)
def procesar_pago(data: PaymentRequest):
    aprobado = random.random() < 0.80

    if aprobado:
        return PaymentResponse(
            aprobado=True,
            mensaje="Pago aprobado exitosamente",
            codigo="APPROVED"
        )
    else:
        return PaymentResponse(
            aprobado=False,
            mensaje="Pago rechazado por el banco emisor",
            codigo="DECLINED"
        )