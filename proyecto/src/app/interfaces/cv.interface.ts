export interface CV {
  id: string;
  resumen: {
    texto: string;
    anos_experiencia: number;
  };
  informacionPersonal: {
    nombre: string;
    correo: string;
    telefono: string;
    ubicacion: string;
  };
  educacion: Array<{
    titulo: string;
    institucion: string;
    fechaInicio: string;  // YYYY-MM
    fechaFin: string;     // YYYY-MM
  }>;
  experienciaLaboral: Array<{
    empresa: string;
    puesto: string;
    fechaInicio: string;  // YYYY-MM
    fechaFin: string;     // YYYY-MM
    descripcion: string;  // Narrativa en tercera persona, máximo 200 palabras
  }>;
  habilidades: string;
  s3_original_key: string;
  certificaciones: Array<{
    nombre: string;
    emisor: string;
    fecha: string;        // YYYY-MM
  }>;
  puntajes: {
    desarrollador_web: number;
    desarrollador_backend: number;
    desarrollador_frontend: number;
    desarrollador_fullstack: number;
    desarrollador_movil: number;
    ingeniero_devops: number;
    arquitecto_software: number;
    administrador_bases_datos: number;
    ingeniero_datos: number;
    especialista_ciberseguridad: number;
    analista_seguridad: number;
    ingeniero_redes: number;
    administrador_sistemas: number;
    cientifico_datos: number;
    ingeniero_machine_learning: number;
    scrum_master: number;
    product_owner: number;
    soporte_tecnico: number;
    especialista_cloud: number;
    qa_tester: number;
    diseñador_ui_ux: number;
  };
  verificado: boolean;
  createdAt: Date;
  updatedAt: Date;
}