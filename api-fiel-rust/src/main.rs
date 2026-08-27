    use axum::{
        extract::{Json, Path, Query, State},
        http::StatusCode,
        routing::{get, post, put},
        Router,
    };
    use serde::{Deserialize, Serialize};
    use sqlx::mysql::MySqlPoolOptions;
    use sqlx::{FromRow, MySqlPool};
    use std::net::SocketAddr;
    use tower_http::cors::{Any, CorsLayer};

    #[derive(Debug, Serialize, Deserialize, FromRow, Clone)]
    pub struct Estudante {
        pub matricula: String,
        pub nome: String,
        pub turma: Option<String>,
        pub turno: Option<String>,
        pub situacao: Option<String>,
        pub data_nascimento: Option<chrono::NaiveDate>,
        pub nome_responsavel: Option<String>,
        pub email: Option<String>,
        pub telefone: Option<String>,
    }

    #[derive(Debug, Deserialize)]
    pub struct FiltroEstudantes {
        pub matricula: Option<String>,
        pub nome: Option<String>,
        pub turma: Option<String>,
        pub turno: Option<String>,
        pub pagina: Option<i64>,
        pub limite: Option<i64>,
    }

    #[derive(Debug, Deserialize)]
    pub struct AtualizarEstudantePayload {
        pub nome: String,
        pub turma: Option<String>,
        pub turno: Option<String>,
        pub situacao: Option<String>,
        pub nome_responsavel: Option<String>,
        pub email: Option<String>,
        pub telefone: Option<String>,
    }

    #[derive(Debug, Deserialize)]
    pub struct NovoEstudante {
        pub matricula: String,
        pub nome: String,
        pub turma: String,
        pub turno: Option<String>,
        pub situacao: Option<String>,
        pub data_nascimento: Option<String>,
        pub nome_responsavel: Option<String>,
        pub email: Option<String>,
        pub telefone: Option<String>,
    }

    #[derive(Debug, Serialize, FromRow)]
    pub struct Usuario {
        pub id: i32,
        pub usuario: String,
        pub senha: String,
    }

    #[derive(Debug, Deserialize)]
    pub struct LoginPayload {
        pub usuario: String,
        pub senha: String,
    }

    // Struct serializada exatamente para o consumo do TSX
#[derive(Debug, Serialize)]
pub struct RespostaPaginada {
        pub dados: Vec<Estudante>,
        pub estudantes: Vec<Estudante>,
        #[serde(rename = "totalPaginas")]
        pub total_paginas: i64,
        #[serde(rename = "totalRegistros")]
        pub total_registros: i64,
        pub pagina: i64,
    }

#[derive(Debug, Serialize, Deserialize)]
pub struct FaltasTrimestres {
    pub faltas_t1: i32,
    pub faltas_t2: i32,
    pub faltas_t3: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FrequenciaPayload {
    pub disciplina: String,
    pub faltas: FaltasTrimestres,
}

#[derive(Debug, FromRow)]
pub struct FrequenciaBanco {
    pub disciplina: String,
    pub faltas_t1: i32,
    pub faltas_t2: i32,
    pub faltas_t3: i32,
}


#[derive(Debug, FromRow)]
pub struct NotaBanco {
    pub disciplina: String,
    pub trimestre1: Option<String>,
    pub trimestre2: Option<String>,
    pub trimestre3: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Trimestres {
    #[serde(default)]
    pub trimestre1: Option<String>,
    #[serde(default)]
    pub trimestre2: Option<String>,
    #[serde(default)]
    pub trimestre3: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NotaPayload {
        pub disciplina: String,
        pub notas: Trimestres,
    }

    async fn buscar_notas(
    Path(matricula): Path<String>,
    State(pool): State<MySqlPool>,
) -> Result<Json<Vec<NotaPayload>>, StatusCode> {
    let resultado = sqlx::query_as::<_, NotaBanco>(
        r#"
        SELECT 
            disciplina, 
            CAST(trimestre1 AS CHAR) AS trimestre1, 
            CAST(trimestre2 AS CHAR) AS trimestre2, 
            CAST(trimestre3 AS CHAR) AS trimestre3
        FROM notas
        WHERE matricula = ?
        ORDER BY disciplina ASC
        "#
    )
    .bind(&matricula)
    .fetch_all(&pool)
    .await;

    match resultado {
        Ok(registros) => {
            let payload: Vec<NotaPayload> = registros
                .into_iter()
                .map(|reg| NotaPayload {
                    disciplina: reg.disciplina,
                    notas: Trimestres {
                        trimestre1: reg.trimestre1,
                        trimestre2: reg.trimestre2,
                        trimestre3: reg.trimestre3,
                    },
                })
                .collect();

            Ok(Json(payload))
        }
        Err(err) => {
            eprintln!("Erro MySQL ao buscar notas: {:?}", err);
            Ok(Json(vec![]))
        }
    }
}

    #[tokio::main]
    async fn main() {
        let database_url = "mysql://root:@localhost:3306/fiel_db";

        let pool = MySqlPoolOptions::new()
            .max_connections(5)
            .connect(database_url)
            .await
            .expect("Erro ao conectar no banco MySQL!");

        let cors = CorsLayer::new()
            .allow_origin(Any)
            .allow_methods(Any)
            .allow_headers(Any);

        let app = Router::new()
            .route("/api/login", post(autenticar_usuario))
            .route("/api/estudantes", get(listar_estudantes).post(cadastrar_estudante))
            .route("/api/estudantes/:matricula", put(atualizar_estudante))
            .route("/api/notas/:matricula", get(buscar_notas).post(salvar_notas))
            .route("/api/frequencia/:matricula", get(buscar_frequencia).post(salvar_frequencia))
            .layer(cors)
            .with_state(pool);

        let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
        println!("API rodando em http://{}", addr);

        let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
        axum::serve(listener, app).await.unwrap();
    }

    async fn listar_estudantes(
        State(pool): State<MySqlPool>,
        Query(filtro): Query<FiltroEstudantes>,
    ) -> Result<Json<RespostaPaginada>, (StatusCode, String)> {
        let matricula_pattern = format!("%{}%", filtro.matricula.unwrap_or_default());
        let nome_pattern = format!("%{}%", filtro.nome.unwrap_or_default());
        let turma_pattern = format!("%{}%", filtro.turma.unwrap_or_default());
        let turno_pattern = format!("%{}%", filtro.turno.unwrap_or_default());

        let pagina = filtro.pagina.unwrap_or(1).max(1);
        let limite = filtro.limite.unwrap_or(10).max(1);
        let offset = (pagina - 1) * limite;

        // Conta o total de estudantes cadastrados no banco
        let (total_registros,): (i64,) = sqlx::query_as(
            r#"
            SELECT COUNT(*) 
            FROM estudantes
            WHERE (? = '%%' OR matricula LIKE ?)
            AND (? = '%%' OR nome LIKE ?)
            AND (? = '%%' OR turma LIKE ?)
            AND (? = '%%' OR turno LIKE ?)
            "#
        )
        .bind(&matricula_pattern)
        .bind(&matricula_pattern)
        .bind(&nome_pattern)
        .bind(&nome_pattern)
        .bind(&turma_pattern)
        .bind(&turma_pattern)
        .bind(&turno_pattern)
        .bind(&turno_pattern)
        .fetch_one(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

        // Busca os dados filtrados e paginados
        let estudantes = sqlx::query_as::<_, Estudante>(
            r#"
            SELECT 
                matricula, nome, turma, turno, situacao, 
                data_nascimento, nome_responsavel, email, telefone
            FROM estudantes
            WHERE (? = '%%' OR matricula LIKE ?)
            AND (? = '%%' OR nome LIKE ?)
            AND (? = '%%' OR turma LIKE ?)
            AND (? = '%%' OR turno LIKE ?)
            ORDER BY matricula ASC
            LIMIT ? OFFSET ?
            "#,
        )
        .bind(&matricula_pattern)
        .bind(&matricula_pattern)
        .bind(&nome_pattern)
        .bind(&nome_pattern)
        .bind(&turma_pattern)
        .bind(&turma_pattern)
        .bind(&turno_pattern)
        .bind(&turno_pattern)
        .bind(limite)
        .bind(offset)
        .fetch_all(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

        let total_paginas = (total_registros as f64 / limite as f64).ceil() as i64;

        Ok(Json(RespostaPaginada {
            dados: estudantes.clone(),
            estudantes,
            total_paginas,
            total_registros,
            pagina,
        }))
    }

    async fn atualizar_estudante(
        Path(matricula): Path<String>,
        State(pool): State<MySqlPool>,
        Json(payload): Json<AtualizarEstudantePayload>,
    ) -> Result<StatusCode, (StatusCode, String)> {
        let resultado = sqlx::query(
            r#"
            UPDATE estudantes
            SET nome = ?, turma = ?, turno = ?, situacao = ?, 
                nome_responsavel = ?, email = ?, telefone = ?
            WHERE matricula = ?
            "#,
        )
        .bind(&payload.nome)
        .bind(&payload.turma)
        .bind(&payload.turno)
        .bind(&payload.situacao)
        .bind(&payload.nome_responsavel)
        .bind(&payload.email)
        .bind(&payload.telefone)
        .bind(&matricula)
        .execute(&pool)
        .await;

        match resultado {
            Ok(_) => Ok(StatusCode::OK),
            Err(err) => {
                eprintln!("Erro MySQL na edição: {:?}", err);
                Err((StatusCode::INTERNAL_SERVER_ERROR, err.to_string()))
            }
        }
    }

    async fn cadastrar_estudante(
        State(pool): State<MySqlPool>,
        Json(payload): Json<NovoEstudante>,
    ) -> Result<StatusCode, (StatusCode, String)> {
        let situacao = payload.situacao.unwrap_or_else(|| "Ativo".to_string());
        let turno = payload.turno.unwrap_or_else(|| "Manhã".to_string());

        let data_nasc = payload.data_nascimento.filter(|s| !s.trim().is_empty());
        let resp = payload.nome_responsavel.filter(|s| !s.trim().is_empty());
        let email = payload.email.filter(|s| !s.trim().is_empty());
        let tel = payload.telefone.filter(|s| !s.trim().is_empty());

        let result = sqlx::query(
            "INSERT INTO estudantes (matricula, nome, turma, turno, situacao, data_nascimento, nome_responsavel, email, telefone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        )
        .bind(payload.matricula)
        .bind(payload.nome)
        .bind(payload.turma)
        .bind(turno)
        .bind(situacao)
        .bind(data_nasc)
        .bind(resp)
        .bind(email)
        .bind(tel)
        .execute(&pool)
        .await;

        match result {
            Ok(_) => Ok(StatusCode::CREATED),
            Err(err) => {
                eprintln!("Erro MySQL: {:?}", err);
                Err((StatusCode::INTERNAL_SERVER_ERROR, err.to_string()))
            }
        }
    }

async fn salvar_notas(
    Path(matricula): Path<String>,
    State(pool): State<MySqlPool>,
    Json(payload): Json<Vec<NotaPayload>>,
) -> Result<StatusCode, (StatusCode, String)> {
    for nota in payload {
        let result = sqlx::query(
            r#"
            INSERT INTO notas (matricula, disciplina, trimestre1, trimestre2, trimestre3)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                trimestre1 = VALUES(trimestre1),
                trimestre2 = VALUES(trimestre2),
                trimestre3 = VALUES(trimestre3)
            "#
        )
        .bind(&matricula)
        .bind(&nota.disciplina)
        .bind(&nota.notas.trimestre1)
        .bind(&nota.notas.trimestre2)
        .bind(&nota.notas.trimestre3)
        .execute(&pool)
        .await;

        if let Err(err) = result {
            eprintln!("Erro MySQL ao salvar nota: {:?}", err);
            return Err((StatusCode::INTERNAL_SERVER_ERROR, err.to_string()));
        }
    }

    Ok(StatusCode::OK)
}

    async fn autenticar_usuario(
        State(pool): State<MySqlPool>,
        Json(payload): Json<LoginPayload>,
    ) -> Result<Json<serde_json::Value>, StatusCode> {
        let result = sqlx::query_as::<_, Usuario>(
            "SELECT id, usuario, senha FROM usuarios WHERE usuario = ? AND senha = ?",
        )
        .bind(&payload.usuario)
        .bind(&payload.senha)
        .fetch_optional(&pool)
        .await;

        match result {
            Ok(Some(user)) => Ok(Json(serde_json::json!({
                "sucesso": true,
                "mensagem": "Autenticado com sucesso",
                "usuario": user.usuario
            }))),
            Ok(None) => Err(StatusCode::UNAUTHORIZED),
            Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
        }
    }


    async fn buscar_frequencia(
    Path(matricula): Path<String>,
    State(pool): State<MySqlPool>,
) -> Result<Json<Vec<FrequenciaPayload>>, StatusCode> {
    let resultado = sqlx::query_as::<_, FrequenciaBanco>(
        r#"
        SELECT disciplina, faltas_t1, faltas_t2, faltas_t3
        FROM frequencia
        WHERE matricula = ?
        ORDER BY disciplina ASC
        "#
    )
    .bind(&matricula)
    .fetch_all(&pool)
    .await;

    match resultado {
        Ok(registros) => {
            let payload: Vec<FrequenciaPayload> = registros
                .into_iter()
                .map(|reg| FrequenciaPayload {
                    disciplina: reg.disciplina,
                    faltas: FaltasTrimestres {
                        faltas_t1: reg.faltas_t1,
                        faltas_t2: reg.faltas_t2,
                        faltas_t3: reg.faltas_t3,
                    },
                })
                .collect();
            Ok(Json(payload))
        }
        Err(_) => Ok(Json(vec![])),
    }
}

async fn salvar_frequencia(
    Path(matricula): Path<String>,
    State(pool): State<MySqlPool>,
    Json(payload): Json<Vec<FrequenciaPayload>>,
) -> Result<StatusCode, (StatusCode, String)> {
    for item in payload {
        let result = sqlx::query(
            r#"
            INSERT INTO frequencia (matricula, disciplina, faltas_t1, faltas_t2, faltas_t3)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                faltas_t1 = VALUES(faltas_t1),
                faltas_t2 = VALUES(faltas_t2),
                faltas_t3 = VALUES(faltas_t3)
            "#
        )
        .bind(&matricula)
        .bind(&item.disciplina)
        .bind(item.faltas.faltas_t1)
        .bind(item.faltas.faltas_t2)
        .bind(item.faltas.faltas_t3)
        .execute(&pool)
        .await;

        if let Err(err) = result {
            return Err((StatusCode::INTERNAL_SERVER_ERROR, err.to_string()));
        }
    }
    Ok(StatusCode::OK)
}