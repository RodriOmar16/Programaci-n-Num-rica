
public class main {

	public static void main(String[] args) {
		PolinomioAprox p = new PolinomioAprox(3,2);
		
		p.cargarPtos();
		System.out.println("\nMuestra de los ptos:");
		p.mostrarPtos();
		
		/*p.vanDerMonde();
		System.out.println("Mostrar Polinomio interpolante por Van Der Monde:");
		p.mostrarPolinomioInterpolante();*/
		
		/*p.lagrange(1);
		System.out.println("\nMostrar Polinomio interpolante por Lagrange:");
		p.mostrarPolinomioInterpolante();*/
		/*p.lagrange(2);
		System.out.println("\nMostrar Polinomio interpolante por Lagrange:");
		p.mostrarPolinomioInterpolante();*/
		
		p.newton();
		System.out.println("\nMostrar Polinomio interpolante por Newton:");
		p.mostrarPolinomioInterpolante();
		
		//p.newtonOsculacion();
		//System.out.println("\nMostrar Polinomio interpolante por Newton OSCULACION:");
		//p.mostrarPolinomioInterpolante();
	}

}








