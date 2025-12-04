import { BookOpen, DollarSign, FileText, TrendingUp, Users } from 'lucide-react';

export const CBAPage = () => {
  const cbaTopics = [
    {
      id: 'salary-cap',
      icon: DollarSign,
      title: 'Salary Cap',
      description: 'Understanding NBA salary cap rules and restrictions',
      content: [
        {
          subtitle: 'What is the Salary Cap?',
          text: 'The NBA salary cap is a limit on the total amount of money that teams can spend on player salaries. It promotes competitive balance by preventing wealthier teams from monopolizing talent.'
        },
        {
          subtitle: 'Hard Cap vs. Soft Cap',
          text: 'The NBA uses a "soft cap" system, meaning teams can exceed the cap under certain exceptions. However, triggering specific transactions can create a "hard cap" that cannot be exceeded.'
        },
        {
          subtitle: 'Key Numbers (2023-24 Season)',
          list: [
            'Salary Cap: $136 million',
            'Luxury Tax Threshold: $165 million',
            'First Apron: $172 million',
            'Second Apron: $182 million'
          ]
        }
      ]
    },
    {
      id: 'luxury-tax',
      icon: TrendingUp,
      title: 'Luxury Tax',
      description: 'How the luxury tax affects team spending',
      content: [
        {
          subtitle: 'Luxury Tax Basics',
          text: 'Teams that exceed the luxury tax threshold must pay a penalty tax on the amount over the threshold. This tax is distributed to non-taxpaying teams.'
        },
        {
          subtitle: 'Tax Rates',
          text: 'Tax rates increase incrementally for every $5 million over the threshold. Repeat offenders (teams over the tax in 3 of the last 4 seasons) pay significantly higher rates.'
        },
        {
          subtitle: 'Apron System',
          list: [
            'First Apron: Teams face transaction restrictions',
            'Second Apron: Severe restrictions including loss of mid-level exception',
            'Cannot use certain trade exceptions',
            'Limits on taking back salary in trades'
          ]
        }
      ]
    },
    {
      id: 'contracts',
      icon: FileText,
      title: 'Contract Types',
      description: 'Different types of NBA player contracts',
      content: [
        {
          subtitle: 'Standard NBA Contracts',
          list: [
            'Rookie Scale Contracts: Fixed amounts for first-round draft picks',
            'Veteran Contracts: Negotiated based on years of service',
            'Maximum Contracts: 25-35% of cap based on experience',
            'Minimum Contracts: League minimum based on years of service'
          ]
        },
        {
          subtitle: 'Special Contract Types',
          list: [
            'Two-Way Contracts: Split time between NBA and G League',
            'Exhibit 10 Contracts: Training camp deals with G League bonus',
            '10-Day Contracts: Short-term deals during season',
            'Designated Veteran Extensions: Super-max deals for stars'
          ]
        }
      ]
    },
    {
      id: 'trades',
      icon: Users,
      title: 'Trade Rules',
      description: 'NBA trade regulations and exceptions',
      content: [
        {
          subtitle: 'Salary Matching Rules',
          text: 'Teams must match salaries within certain thresholds when trading. Non-taxpaying teams have more flexibility than teams over the luxury tax.'
        },
        {
          subtitle: 'Common Exceptions',
          list: [
            'Mid-Level Exception: Sign free agents up to ~$12 million',
            'Bi-Annual Exception: Sign players up to ~$4 million',
            'Traded Player Exception: Created when trading away more salary',
            'Bird Rights: Re-sign own players exceeding the cap'
          ]
        },
        {
          subtitle: 'Trade Deadline & Restrictions',
          list: [
            'Trade deadline typically in mid-February',
            'Recently signed free agents have trade restrictions',
            'Draft picks can be traded with protections',
            'Players can have no-trade clauses (limited circumstances)'
          ]
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-900 to-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <BookOpen className="w-12 h-12" />
            <h1 className="text-5xl font-bold">CBA Rules</h1>
          </div>
          <p className="text-xl opacity-90 max-w-3xl">
            Understanding the NBA Collective Bargaining Agreement: salary cap, luxury tax,
            contracts, and trade regulations explained in simple terms.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {cbaTopics.map((topic) => {
            const Icon = topic.icon;
            return (
              <div key={topic.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="w-8 h-8 text-white" />
                    <h2 className="text-2xl font-bold text-white">{topic.title}</h2>
                  </div>
                  <p className="text-blue-100">{topic.description}</p>
                </div>

                <div className="p-6 space-y-6">
                  {topic.content.map((section, index) => (
                    <div key={index}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {section.subtitle}
                      </h3>
                      {section.text && (
                        <p className="text-gray-700 leading-relaxed mb-3">{section.text}</p>
                      )}
                      {section.list && (
                        <ul className="space-y-2">
                          {section.list.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-blue-600 font-bold mt-1">•</span>
                              <span className="text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Important Note</h3>
          <p className="text-gray-700 leading-relaxed">
            The NBA CBA is complex and changes periodically. These are simplified explanations
            of key concepts. For official rules and the most current information, refer to the
            official NBA Collective Bargaining Agreement documentation.
          </p>
        </div>
      </div>
    </div>
  );
};
