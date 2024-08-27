public class main {

	public static void main(String[] args) {
		funcionEmpirica f = new funcionEmpirica(5);
		
		f.cargarListaPtos();
		if(f.controlarPtos()) {
			f.mostrarListaPtos();
			f.linealizacion("Exponencial");
			System.out.println("\nLuego de linealizar:");
			f.puntosSeleccionados(0,4);
			System.out.println("Parámetros a: "+f.getA());
			System.out.println("Parámetros b: "+f.getB());
		}else System.out.println("fallo");
	}

}
