
public class main {

	public static void main(String[] args) {
		PolinomioAprox p = new PolinomioAprox(3);
		
		p.cargarPtos();
		System.out.println("\nMuestra de los ptos:");
		p.mostrarPtos();
		
		p.vanDerMonde();
		System.out.println("Mostrar Polinomio interpolante por Van Der Monde:");
		p.mostrarPolinomioInterpolante();

	}

}
