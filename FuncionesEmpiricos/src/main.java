public class main {

	public static void main(String[] args) {
		funcionEmpirica f = new funcionEmpirica(4);
		
		f.cargarListaPtos();
		if(f.controlarPtos()) {
			f.mostrarListaPtos();
			f.linealizacion("Racional");
			f.puntosSeleccionados(0,3);			
		}else System.out.println("fallo");
	}

}
