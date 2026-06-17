import random


def process_payment(monto: float, tarjeta_id: int, usuario_id: int) -> dict:
    aprobado = random.random() < 0.80

    if aprobado:
        return {
            'aprobado': True,
            'mensaje': 'Pago aprobado exitosamente',
            'codigo': 'APPROVED',
        }

    return {
        'aprobado': False,
        'mensaje': 'Pago rechazado por el banco emisor',
        'codigo': 'DECLINED',
    }
