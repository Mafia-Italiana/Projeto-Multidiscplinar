import json
import sys
import os
from datetime import datetime

LOGS_DIR = os.path.join(os.path.dirname(__file__), 'logs')

if not os.path.exists(LOGS_DIR):
    os.makedirs(LOGS_DIR)

LOG_FILE_PATH = os.path.join(LOGS_DIR, 'historico_alteracoes.json')

def registrar_log(usuario, acao, entidade, dado_antigo, dado_novo):
    """
    Registra um evento de alteração no formato JSON dentro da pasta logs.
    """
    log_entry = {
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "usuario": usuario,
        "acao": acao,            # Ex: "UPDATE", "INSERT", "DELETE"
        "entidade": entidade,    # Ex: "aluno", "nota", "turma"
        "dado_antigo": dado_antigo,
        "dado_novo": dado_novo
    }

    logs = []
    
    if os.path.exists(LOG_FILE_PATH):
        try:
            with open(LOG_FILE_PATH, 'r', encoding='utf-8') as f:
                logs = json.load(f)
        except json.JSONDecodeError:
            logs = []

    logs.insert(0, log_entry)

    with open(LOG_FILE_PATH, 'w', encoding='utf-8') as f:
        json.dump(logs, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    if len(sys.argv) >= 6:
        usuario = sys.argv[1]
        acao = sys.argv[2]
        entidade = sys.argv[3]
        dado_antigo = sys.argv[4]
        dado_novo = sys.argv[5]

        try:
            dado_antigo = json.loads(dado_antigo)
        except Exception:
            pass

        try:
            dado_novo = json.loads(dado_novo)
        except Exception:
            pass

        registrar_log(usuario, acao, entidade, dado_antigo, dado_novo)
        print(json.dumps({"status": "sucesso"}))
    else:
        registrar_log(
            usuario="admin@fiel.com",
            acao="UPDATE",
            entidade="nota_matematica",
            dado_antigo={"aluno_id": 10, "nota": 5.5},
            dado_novo={"aluno_id": 10, "nota": 8.0}
        )
        print("Log de teste registrado na pasta analytics/logs/ com sucesso!")